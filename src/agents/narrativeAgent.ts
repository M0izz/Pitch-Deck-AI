import type {
  UserBusinessInput,
  Slide
} from '../types/pitch';
import type { ResearchDossier } from './researchAgent';
import { generateDynamicSlides } from './dynamicGenerator';

export function draft10SlideBlueprint(
  input: UserBusinessInput,
  research: ResearchDossier,
  _selectedArchetypeId?: string
): Slide[] {
  // Generate 100% dynamic, tailored slides based specifically on user's concept, ICP, vertical, and moat
  return generateDynamicSlides(input, research);
}
