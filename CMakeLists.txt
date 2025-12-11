cmake_minimum_required(VERSION 3.25)

project(tried-bd-modules-2025 VERSION 1.0.0)

enable_language(CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(CMAKE_CXX_COMPILER_ID MATCHES "MSVC")
    add_compile_options(/utf-8)
endif()

add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/External/JUCE)

set(BaseTargetName PluginWithBDModules)

# Add JUCE modules for bd_ui_loader and its dependencies
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/Gin/modules/gin)
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/Gin/modules/gin_graphics)
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/bd_binary_asset_utilities)
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/bd_image_resampler)
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/playfultones_smoothresizing)
juce_add_module(${CMAKE_CURRENT_LIST_DIR}/External/bd_ui_loader)

# Collect all knob frame images
file(GLOB KNOB_FRAMES "${CMAKE_CURRENT_LIST_DIR}/Resources/Knob_*.png")

# Add binary data target with all resources
juce_add_binary_data(PluginBinaryData
    SOURCES
        Resources/my_plugin_ui.xml
        Resources/Background.png
        ${KNOB_FRAMES}
)

juce_add_plugin("${BaseTargetName}"
    COMPANY_NAME "MyCompany"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    PLUGIN_MANUFACTURER_CODE Cox2
    PLUGIN_CODE Pbdm
    FORMATS AU VST3 Standalone
    PRODUCT_NAME "PluginWithBDModules")

target_sources(${BaseTargetName} PRIVATE
    Source/PluginProcessor.cpp
    Source/PluginProcessor.h
    Source/PluginEditor.cpp
    Source/PluginEditor.h)

target_compile_definitions(${BaseTargetName}
    PUBLIC
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    JUCE_VST3_CAN_REPLACE_VST2=0)

target_link_libraries(${BaseTargetName}
    PRIVATE
        PluginBinaryData  # Link the binary data target
        juce::juce_audio_utils
        bd_binary_asset_utilities
        bd_image_resampler
        bd_ui_loader
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)