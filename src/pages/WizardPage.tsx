import { useWizardState } from '../hooks/useWizardState';
import WizardShell from '../components/wizard/WizardShell';
import WelcomeStep from '../components/wizard/steps/WelcomeStep';
import ChannelStep from '../components/wizard/steps/ChannelStep';
import PreferencesStep from '../components/wizard/steps/PreferencesStep';
import ConversationStep from '../components/wizard/steps/ConversationStep';
import NameAgentStep from '../components/wizard/steps/NameAgentStep';
import SetupStep from '../components/wizard/steps/SetupStep';

export default function WizardPage() {
  const w = useWizardState();

  const isSetup = w.step === 5;
  const showNav = w.step > 0 && !isSetup;

  const stepContent = () => {
    switch (w.step) {
      case 0:
        return <WelcomeStep onNext={w.next} />;
      case 1:
        return (
          <ChannelStep
            selected={w.state.channel}
            onSelect={w.setChannel}
            onNext={w.next}
          />
        );
      case 2:
        return (
          <PreferencesStep
            selected={w.state.preferences}
            onToggle={w.togglePreference}
            onNext={w.next}
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
          <NameAgentStep
            agentName={w.state.agentName}
            userName={w.state.profile?.name || ''}
            onSetName={w.setAgentName}
            onNext={w.next}
          />
        );
      case 5:
        return (
          <SetupStep
            agentName={w.state.agentName}
            userName={w.state.profile?.name || ''}
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
      canGoBack={w.step > 0 && !isSetup}
      showNav={showNav}
      onBack={w.back}
    >
      {stepContent()}
    </WizardShell>
  );
}
