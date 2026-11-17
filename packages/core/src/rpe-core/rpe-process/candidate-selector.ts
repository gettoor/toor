import { 
  RPECandidateSelector,
  RPECandidateSelectorOutput,
} from '../rpe-candidate-selector/index.js';
import { RPEState } from '../rpe-state/index.js';

export async function selectCandidates(
  state: RPEState,
  candidateSelector: RPECandidateSelector,
): Promise<RPECandidateSelectorOutput> {
  const output = await candidateSelector.run(state, {});

  // remove duplicates
  const candidateRefs = output.candidateRefs.filter(
    (candidateRef, index, self) => {
      const selfIndex = self.findIndex(itr => {
        return itr.candidateId === candidateRef.candidateId;
      });
      return selfIndex === index;
    }
  );

  return {
    ...output,
    candidateRefs,
  };
}