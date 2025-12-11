#include "PluginProcessor.h"
#include "PluginEditor.h"
#include <BinaryData.h>

//==============================================================================
AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p)
    , processorRef (p)
    , imageLoader(BinaryData::namedResourceList,
        BinaryData::namedResourceListSize,
        BinaryData::getNamedResource,
        BinaryData::getNamedResourceOriginalFilename)
{
    juce::ignoreUnused (processorRef);

    addAndMakeVisible(uiContainer);

    // Create UILoader with container component
    uiLoader = std::make_unique<BogrenDigital::UILoading::UILoader>(uiContainer, imageLoader);

    // Load the UI
    uiLoader->loadUI("my_plugin_ui.xml");

    // Make resizable
    setResizable(true, true);
    setResizeLimits(400, 300, 1600, 1200);
    setSize(uiContainer.getWidth(), uiContainer.getHeight());
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}

//==============================================================================
void AudioPluginAudioProcessorEditor::paint (juce::Graphics& g)
{
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));
}

void AudioPluginAudioProcessorEditor::resized()
{
    // Size the container first, then apply layout
    uiContainer.setBounds(getLocalBounds());
    uiLoader->applyLayout();
}
