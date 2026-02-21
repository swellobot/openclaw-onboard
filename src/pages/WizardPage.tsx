import { useWizardState } from '../hooks/useWizardState';
import WizardShell from '../components/wizard/WizardShell';
import NameAgentStep from '../components/wizard/steps/NameAgentStep';
import ScenarioShowcaseStep from '../components/wizard/steps/ScenarioShowcaseStep';
import PersonalityPickerStep from '../components/wizard/steps/PersonalityPickerStep';
import ConversationStep from '../components/wizard/steps/ConversationStep';
import ChannelStep from '../components/wizard/steps/ChannelStep';
import LaunchStep from '../components/wizard/steps/LaunchStep';

export default function WizardPage() {
  const w = useWizardState();

  const isLaunch = w.step === 5;
  const isPersonality = w.step === 2;
  const showNav = w.step > 0 && !isLaunch && !isPersonality;

  const stepContent = () => {
    switch (w.step) {
      case 0:
        return (
          <NameAgentStep
            agentName={w.state.agentName}
            onSetName={w.setAgentName}
            onNext={w.next}
          />
        );
      case 1:
        return (
          <ScenarioShowcaseStep
            agentName={w.state.agentName}
            selected={w.state.selectedScenarios}
            onToggle={w.toggleScenario}
            onNext={w.next}
          />
        );
      case 2:
        return (
          <PersonalityPickerStep
            agentName={w.state.agentName}
            choices={w.state.personalityChoices}
            onChoice={w.addPersonalityChoice}
            onNext={w.next}
            onBack={w.back}
          />
        );
      case 3:
        return (
          <ConversationStep
            sessionId={w.sessionId}
            channel={w.state.channel || ''}
            messages={w.state.conversationMessages}
            conversationDone={w.state.conversationDone}
            onAddMessage={w.addConversationMessage}
            onDone={w.setConversationDone}
            onNext={w.next}
          />
        );
      case 4:
        return (
          <ChannelStep
            agentName={w.state.agentName}
            selected={w.state.channel}
            onSelect={w.setChannel}
            onNext={w.next}
          />
        );
      case 5:
        return (
          <LaunchStep
            agentName={w.state.agentName}
            userName={w.state.profile?.name || ''}
            channel={w.state.channel}
            onComplete={w.complete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardShell
      step={w.step}
      direction={w.direction}
      progress={w.progress}
      totalSteps={w.totalSteps}
      canGoBack={w.step > 0 && !isLaunch}
      showNav={showNav}
      onBack={w.back}
    >
      {stepContent()}
    </WizardShell>
  );
}
