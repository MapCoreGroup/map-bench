import json
import os
import glob
import sys
import subprocess
import fnmatch
import re
import tkinter as tk
from tkinter import messagebox
from datetime import datetime
import shutil
import platform
from pathlib import Path

# ---- Map-bench layout bootstrap (script moved into: <map-bench>/build mapcore) ----
script_dir = Path(__file__).resolve().parent              # ...\map-bench\build mapcore
bench_root = script_dir.parent                             # ...\map-bench

# MapCore root: default sibling folder, or override with env var
mapcore_root = Path(os.environ.get("MAPCORE_ROOT", str(bench_root.parent / "mapcore"))).resolve()

# conan_common import
sys.path.insert(0, str(mapcore_root / "conan-recipe"))
from conan_common import emsdk_version, get_conan_home

# We work from map-bench root
curr_project_path = str(bench_root)
os.chdir(curr_project_path)

# MapCore paths
root_path = str(mapcore_root)
print(f"mapcore root dir: {root_path}")

cmake_settings_file = str(mapcore_root / "CMakeSettings.json")
emscripten_bin_path = str(mapcore_root / "bin" / "Emscripten")

# Files that live next to this script (inside build mapcore)
last_cmake_configuration_file = str(script_dir / "last_cmake_configuration.txt")
auto_config_file = str(script_dir / "wasm_config.json")

# map-bench public/index.html
html_file = str(bench_root / "public" / "index.html")

# Output folder: map-bench/public/package
package_dir = str(bench_root / "public" / "package")
os.makedirs(package_dir, exist_ok=True)

# CLI mode:
#   python wasm_config.py auto
#   python wasm_config.py             (interactive)
auto_config = len(sys.argv) > 1 and sys.argv[1] == "auto"
curr_config_path = sys.argv[1] if len(sys.argv) > 1 and "Emscripten" in sys.argv[1] else None

# Add Ninja to Path (only if the folder exists)
ninja_dir_path = r"C:\Program Files\Microsoft Visual Studio\2022\Professional\Common7\IDE\CommonExtensions\Microsoft\CMake\Ninja"
if os.path.isdir(ninja_dir_path):
    os.environ["PATH"] = ninja_dir_path + os.pathsep + os.environ["PATH"]

def load_cmake_settings():
    """Load and parse CMakeSettings.json"""
    if not os.path.exists(cmake_settings_file):
        print(f"Error: {cmake_settings_file} not found!")
        sys.exit(1)

    with open(cmake_settings_file, "r", encoding="utf-8-sig") as f:
        contents = f.read()
        try:
            settings = json.loads(contents)  # Try parsing
        except json.JSONDecodeError as e:
            print("\nJSON Parse Error!")
            sys.exit(1)
            
    settings["configurations"] = [config for config in settings["configurations"] if "Emscripten" in config["name"]]
    return settings

def resolve_variables(value, root_path, config_name):
    """Replace placeholders like ${projectDir}, ${name}, and %ENV_VARIABLE%"""
    value = value.replace("${projectDir}", root_path).replace("${name}", config_name)
    return os.path.expandvars(value)  # Convert %userprofile% and other env variables

def select_configuration(configurations):
    """Prompt the user to select a CMake configuration, or skip selection."""
    print("\nAvailable Configurations:")    
    print("0. Do not select a configuration")
    for i, config in enumerate(configurations, start=1):
        print(f"{i}. {config['name']} ({config['generator']})")


    while True:
        try:
            choice = int(input("\nEnter the number of the configuration to use (or 0 to skip): "))
            if choice == 0:
                print("No configuration selected.")
                return None  # Indicate that no configuration was selected
            elif 1 <= choice <= len(configurations):
                return configurations[choice - 1]  # Return the selected configuration
            else:
                print("Invalid choice, please select a valid number.")
        except ValueError:
            print("Invalid input, please enter a number.")


def find_emsdk_toolchain(version):
    base_path = Path(get_conan_home()) / ".conan" / "data" / "emsdk" / version / "_" / "_" / "package"
    if not base_path.exists():
        print(f"No emsdk version {version} found.")
        return None

    # Find all folders under "package"
    package_dirs = [d for d in base_path.iterdir() if d.is_dir()]
    if not package_dirs:
        print("No package folders found.")
        return None

    # Print all found package folders
    for pkg_dir in package_dirs:
        print(f"Found package folder: {pkg_dir}")

    return os.path.join(package_dirs[0], "bin", "upstream", "emscripten", "cmake", "Modules", "Platform", "Emscripten.cmake")

def generate_cmake_command(config):
    """Generate the cmake command based on the selected configuration"""
    generator = config.get("generator", "Ninja")
    build_root = resolve_variables(config.get("buildRoot", f"{root_path}/out/build/{config['name']}"), root_path, config["name"])
    install_root = resolve_variables(config.get("installRoot", f"{root_path}/out/install/{config['name']}"), root_path, config["name"])
    build_command_args = config.get("buildCommandArgs", "")
    variables = config.get("variables", [])
    cmake_build_type = config.get("configurationType", "Release")

    if platform.system() == "Linux":
        build_root = build_root.replace("\\", "/")
        install_root = install_root.replace("\\", "/")
    
    # Construct the base CMake command
    cmake_cmd = [
        "cmake", "-G", generator, "-S", ".", "-B", build_root, f"-DCMAKE_INSTALL_PREFIX={install_root}", f"-DCMAKE_BUILD_TYPE={cmake_build_type}"
    ]

    # Add CMake variables
    for var in variables:
        name = var["name"]
        value = var["value"]
        if platform.system() == "Linux" and name == "CMAKE_TOOLCHAIN_FILE":
            value = find_emsdk_toolchain(emsdk_version)
        value = os.path.expandvars(value)
        cmake_cmd.append(f"-D{name}={value}")

    # Include extra build arguments if specified
    #if build_command_args:
    #    cmake_cmd.append(build_command_args)

    return cmake_cmd, build_root

def get_cmake_targets(build_root):
    """Retrieve all available CMake targets"""
    print("\nFetching available CMake targets...")
    try:
        result = subprocess.run(
            ["cmake", "--build", build_root, "--target", "help"],
            capture_output=True,
            text=True,
            check=True
        )
        targets = [line.strip() for line in result.stdout.splitlines() if line.strip()]
        targets = fnmatch.filter(targets, "MapCore*.js*")
        targets = [t.split(".js")[0] for t in targets]

        if not targets:
            print("No targets found.")
            sys.exit(1)

        return targets

    except subprocess.CalledProcessError:
        print("Error: Could not retrieve target list.")
        sys.exit(1)

def prompt_user_for_target(targets):
    """Prompt the user to select a target to build"""
    print("\nAvailable CMake Targets:")
    for i, target in enumerate(targets, start=1):
        print(f"{i}. {target}")

    while True:
        try:
            choice = int(input("\nEnter the number of the target to build: "))
            if 1 <= choice <= len(targets):
                return targets[choice - 1]
            else:
                print("Invalid choice, please select a valid number.")
        except ValueError:
            print("Invalid input, please enter a number.")
    
def config_to_bin_path(config):
    """ e.g. Emscripten32-MT-Debug --> bin/wasm32-MT/Debug 
             Emscripten32-ST-Debug-ASan --> bin/wasm32-ST/Debug-ASan """
    # Replace Emscripten32/64 with wasm32/64
    config = config.replace("Emscripten32", "wasm32").replace("Emscripten64", "wasm64")

    # Split after the second hyphen (wasm32-ST vs Debug-ASan)
    # Find the position of the second hyphen
    hyphen_count = 0
    split_pos = -1
    for i, char in enumerate(config):
        if char == '-':
            hyphen_count += 1
            if hyphen_count == 2:
                split_pos = i
                break
    
    if split_pos != -1:
        arch_threading = config[:split_pos]  # e.g., "wasm32-ST"
        build_variant = config[split_pos+1:]  # e.g., "Debug-ASan"
        bin_path = os.path.join(emscripten_bin_path, arch_threading, build_variant)
    else:
        return None

    return bin_path

def bin_path_to_config(file_path):
    """ e.g. path/to/wasm32-MT/Debug/MapCore_D.js --> Emscripten32-MT-Debug, MapCore_D
             path/to/wasm32-ST/Debug-ASan/MapCore_D.js --> Emscripten32-ST-Debug-ASan, MapCore_D """
    # Extract parts of the path - updated regex to handle compound build types
    match = re.search(r"wasm(\d+)-(\w+)\\([\w-]+)(?:\\([^\\]+)\.js)?$", file_path)

    if match:
        num = match.group(1)
        threading = match.group(2)
        build_variant = match.group(3)  # Now can be "Debug", "Release", "Debug-ASan", etc.
        target = match.group(4)
        wasm_config = f"Emscripten{num}-{threading}-{build_variant}"
        return wasm_config, target
    return None, None

def set_default_config(selected_target):
    choice = input("Set as default configuration? (y/n): ").strip().lower()
    if choice == "y":
        wasm_config, wasm_target = bin_path_to_config(selected_target)

        if not os.path.exists(auto_config_file):
            print(f"Error: {auto_config_file} not found!")
            sys.exit(1)

        with open(auto_config_file, "r") as file:
            wasm_configurations = json.load(file)
            wasm_configurations["configuration"] = wasm_config
            wasm_configurations["target"] = wasm_target

        with open(auto_config_file, "w") as file:
            json.dump(wasm_configurations, file, indent=4)

        print(f"{auto_config_file} Updated successfully\nNew configurations are: \n{wasm_configurations}")
    else:
        print("Default configurations have not changed.")


def select_built_js_target(selected_config_path):
    # Search recursively for JavaScript files under the "bin" folder.
    print(f"{emscripten_bin_path}  {selected_config_path}")
    js_files = glob.glob(os.path.join(emscripten_bin_path, selected_config_path, "**", "MapCore*.js"), recursive=True)

    # Filter out files that contain "orker" (".worker.js", "_Worker.js", "_Worker_D.js").
    js_files = [js for js in js_files if js.find("orker") < 0]

    if not js_files:
        print("No MapCore*.js files (excluding .worker.js) found in the ./bin folder.")
        exit(1)

    # Build a list of tuples: (target_path, display_string).
    # The display string includes the full path and the file's last modified date.
    js_targets_file_data = []
    for js_file in js_files:
        mod_time = os.path.getmtime(js_file)
        mod_date = datetime.fromtimestamp(mod_time).strftime("%Y-%m-%d %H:%M:%S")
        display_str = f"{js_file} - {mod_date}"
        js_targets_file_data.append((js_file, display_str))

    """Prompt the user all available targets"""
    print("\nExisting Built Targets:")
    for i, target in enumerate(js_targets_file_data, start=1):
        print(f"{i}. {target[1]}")

    while True:
        try:
            choice = int(input("\nEnter the number of the target to config: "))
            if 1 <= choice <= len(js_targets_file_data):
                return js_targets_file_data[choice - 1][0]
            else:
                print("Invalid choice, please select a valid number.")
        except ValueError:
            print("Invalid input, please enter a number.")


def create_symlink(target: str, link_path: str) -> None:
    # Ensure parent directory exists
    parent = os.path.dirname(os.path.abspath(link_path))
    if parent:
        os.makedirs(parent, exist_ok=True)

    # If anything exists there (including a *broken* symlink), remove it
    if os.path.lexists(link_path):
        if os.path.islink(link_path) or os.path.isfile(link_path):
            os.unlink(link_path)
            print(f"Removed existing file/symlink: {link_path}")
        elif os.path.isdir(link_path):
            shutil.rmtree(link_path)
            print(f"Removed existing directory: {link_path}")

    # On Windows, specify whether the target is a directory
    kwargs = {}
    if os.name == "nt":
        kwargs["target_is_directory"] = os.path.isdir(target)

    os.symlink(target, link_path, **kwargs)
    print(f"Symlink created: {link_path} -> {target}")

        

def build_default_target(settings, force_build=False):
    if not os.path.exists(auto_config_file):
        print(f"Error: {auto_config_file} not found!")
        sys.exit(1)

    with open(auto_config_file, "r") as file:
        wasm_configurations = json.load(file)  # Parse JSON into a dictionary

        config_name = wasm_configurations["configuration"]
        target_name = wasm_configurations["target"]
        build_target = wasm_configurations["build"]
    
        selected_config = next((config for config in settings["configurations"] if config["name"] == config_name), None)
        if not selected_config:
            print(f"{config_name} not found in {cmake_settings_file}")
            sys.exit(1)
    
    target_js = os.path.join(config_to_bin_path(selected_config['name']), target_name + ".js")
    
    if not build_target and not os.path.exists(target_js):
        print(f"default configuration {target_js} does not exist. forcing build.")
        force_build = True
        
    if build_target or force_build:
        # Generate the CMake command
        cmake_command, build_root = generate_cmake_command(selected_config)

        # Print and execute the command
        print("\nGenerated CMake Command:")
        print(" ".join(cmake_command))

        # Run the CMake command. last_cmake_configuration_file is initialized in CreateVS scripts.
        #if not os.path.isdir(build_root):

        if platform.system() == "Windows":
            activated_from_vs_windows = "VisualStudioVersion" in os.environ
        else:
            activated_from_vs_windows = False


        activate_cmake_configuration = True
        if activated_from_vs_windows:
            last_cmake_configuration = ""
            if os.path.exists(last_cmake_configuration_file):
                with open(last_cmake_configuration_file, "r", encoding="utf-8") as f:
                    last_cmake_configuration = f.read()

            if last_cmake_configuration == config_name:
                activate_cmake_configuration = False
                print(f"{config_name} was found in {last_cmake_configuration_file}. skipping cmake generation")

            with open(last_cmake_configuration_file, "w", encoding="utf-8") as f:
                f.write(config_name)

        if activate_cmake_configuration:
            os.chdir(root_path)
            subprocess.run(cmake_command, check=True)
            os.chdir(curr_project_path)

            
        # Get available CMake targets
        targets = get_cmake_targets(build_root)
        print(f"Available targets: {targets}")

        if target_name in targets:
            selected_target = target_name
        else:
            print(f"{target_name} not found in {config_name} targets")
            sys.exit(1)

        # Build the selected target
        print(f"\nBuilding target: {selected_target}...")
        build_command = ["cmake", "--build", build_root, "--target", selected_target, "--config", selected_config.get("configurationType", "Release")]
        subprocess.run(build_command, check=True)

    return target_js
    

def copy_dts(dts_source_dir):
    for dest_project_dir in [curr_project_path]:
        types_dir = os.path.join(dest_project_dir, "src", "types")
        os.makedirs(types_dir, exist_ok=True)
        
        dts_filename = "MapCore.d.ts" # MapCore_Module.d.td, MapCoreNode.d.ts are not required
        src_file = os.path.join(dts_source_dir, dts_filename)
        dest_file = os.path.join(types_dir, dts_filename)
        shutil.copy2(src_file, dest_file)
        print(f"Copied: {src_file} -> {dest_file}")


def main(): 
    # Load CMake settings
    settings = load_cmake_settings()

    # Ensure there are configurations available
    if "configurations" not in settings or not settings["configurations"]:
        print("Error: No configurations found in CMakeSettings.json.")
        sys.exit(1)

    # Use predefined configurations to build and refer
    target_js = build_default_target(settings)

    if target_js:
        target_js_dir = os.path.dirname(target_js)
        
        ###### Copy associated .d.ts
        base_dts_dir = os.path.join(root_path, "MapCore","Emscripten", "Wasm")
        copy_dts(base_dts_dir)
        #copy_dts(target_js_dir)

        ###### Link to target .js, .wasm and .zip resources
        target_wasm = target_js.replace(".js", ".wasm")
        target_wasm_map = target_js.replace(".js", ".wasm.map")
        target_worker_js = target_js.replace(".js", "_Worker.js")
        target_worker_js = target_worker_js.replace("_D_Worker.js", "_Worker_D.js")
        target_worker_wasm = target_worker_js.replace(".js", ".wasm")
        target_worker_wasm_map = target_worker_js.replace(".js", ".wasm.map")

        create_symlink(target_js, os.path.join(package_dir, os.path.basename(target_js)))
        create_symlink(target_wasm, os.path.join(package_dir, os.path.basename(target_wasm)))
        if os.path.exists(target_wasm_map):
         create_symlink(target_wasm_map, os.path.join(package_dir, os.path.basename(target_wasm_map)))
        if os.path.exists(target_worker_js):
         create_symlink(target_worker_js, os.path.join(package_dir, os.path.basename(target_worker_js)))
        if os.path.exists(target_worker_wasm):
         create_symlink(target_worker_wasm, os.path.join(package_dir, os.path.basename(target_worker_wasm)))
        if os.path.exists(target_worker_wasm_map):
         create_symlink(target_worker_wasm_map, os.path.join(package_dir, os.path.basename(target_worker_wasm_map)))

        for file in os.listdir(target_js_dir):
            if file.endswith(".zip"):
                target = os.path.join(target_js_dir, file)
                symlink = os.path.join(package_dir, file)
                create_symlink(target, symlink)    
                
        if not auto_config:
            set_default_config(target_js)
            
    else:
        print(f"No target found to config.")

if __name__ == "__main__":
    main()
