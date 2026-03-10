import { APSWorkbench } from './aps-workbench/APSWorkbench';

interface APSDemoProps {
  onStepComplete?: (response: string) => void;
  expectedResponse?: string;
}

export default function APSDemo({ onStepComplete, expectedResponse = '' }: APSDemoProps) {
  return (
    <div className="h-full w-full overflow-hidden" data-testid="aps-demo">
      <APSWorkbench />
    </div>
  );
}
