#pragma once

#include "PluginProcessor.h"
#include <bd_ui_loader/bd_ui_loader.h>

//==============================================================================
class AudioPluginAudioProcessorEditor final
    : public juce::AudioProcessorEditor
{
public:
    explicit AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor&);
    ~AudioPluginAudioProcessorEditor() override;

    //==============================================================================
    void paint (juce::Graphics&) override;
    void resized() override;

private:
    //==============================================================================
    AudioPluginAudioProcessor& processorRef;

    juce::Component uiContainer;
    BogrenDigital::UILoading::BinaryAssetImageLoader imageLoader;
    std::unique_ptr<BogrenDigital::UILoading::UILoader> uiLoader;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (AudioPluginAudioProcessorEditor)
};
