import { RPECandidate } from '@gettoor/core';
import clsx from 'clsx';

import { CandidateModule } from './CandidateModule';

export interface CandidateModulesProps {
  candidate: RPECandidate;
  className?: string;
}

export function CandidateModules(props: CandidateModulesProps) {
  const { candidate, className } = props;

  const renderModules = () => {
    const names = Object.keys(candidate.modules || {}).sort();
    return names.map((name) => {
      const module = candidate.modules[name]!;
      return (
        <CandidateModule
          key={name}
          name={name}
          module={module.content}
        />
      );
    });
  };

  return (
    <div className={className}>
      { renderModules() }
    </div>
  );
}