import type React from 'react';
import type { SvgProps } from 'react-native-svg';
import ABWheelRollout from '../assets/exercises/ab-wheel-rollout/frame-1.svg';
import BarbellRow from '../assets/exercises/barbell-row/frame-1.svg';
import BenchPress from '../assets/exercises/bench-press/frame-1.svg';
import BulgarianSplitSquat from '../assets/exercises/bulgarian-split-squat/frame-1.svg';
import CableFly from '../assets/exercises/cable-fly/frame-1.svg';
import CableKickback from '../assets/exercises/cable-kickback/frame-1.svg';
import CloseGripBenchPress from '../assets/exercises/close-grip-bench-press/frame-1.svg';
import Deadlift from '../assets/exercises/deadlift/frame-1.svg';
import DiamondPushUp from '../assets/exercises/diamond-push-up/frame-1.svg';
import Dips from '../assets/exercises/dips/frame-1.svg';
import FrontRaise from '../assets/exercises/front-raise/frame-1.svg';
import GluteBridge from '../assets/exercises/glute-bridge/frame-1.svg';
import HammerCurl from '../assets/exercises/hammer-curl/frame-1.svg';
import HangingLegRaise from '../assets/exercises/hanging-leg-raise/frame-1.svg';
import HipThrust from '../assets/exercises/hip-thrust/frame-1.svg';
import InclineDumbbellCurl from '../assets/exercises/incline-dumbbell-curl/frame-1.svg';
import InclineDBPress from '../assets/exercises/incline-dumbbell-press/frame-1.svg';
import JumpRope from '../assets/exercises/jump-rope/frame-1.svg';
import LatPulldown from '../assets/exercises/lat-pulldown/frame-1.svg';
import LateralRaise from '../assets/exercises/lateral-raise/frame-1.svg';
import LegCurl from '../assets/exercises/leg-curl/frame-1.svg';
import LegExtension from '../assets/exercises/leg-extension/frame-1.svg';
import LegPress from '../assets/exercises/leg-press/frame-1.svg';
import OverheadPress from '../assets/exercises/overhead-press/frame-1.svg';
import OverheadTricepExtension from '../assets/exercises/overhead-tricep-extension/frame-1.svg';
import Plank from '../assets/exercises/plank/frame-1.svg';
import PreacherCurl from '../assets/exercises/preacher-curl/frame-1.svg';
import PullUp from '../assets/exercises/pull-up/frame-1.svg';
import PushUp from '../assets/exercises/push-up/frame-1.svg';
import RomanianDeadlift from '../assets/exercises/romanian-deadlift/frame-1.svg';
import RussianTwist from '../assets/exercises/russian-twist/frame-1.svg';
import SeatedRow from '../assets/exercises/seated-row/frame-1.svg';
import SkullCrusher from '../assets/exercises/skull-crusher/frame-1.svg';
import StandingCalfRaise from '../assets/exercises/standing-calf-raise/frame-1.svg';
import StationaryCycling from '../assets/exercises/stationary-cycling/frame-1.svg';
import SumoDeadlift from '../assets/exercises/sumo-deadlift/frame-1.svg';
import TricepsPushdown from '../assets/exercises/triceps-pushdown/frame-1.svg';

const exerciseMap: Record<string, React.FC<SvgProps>> = {
  'bench-press': BenchPress,
  'overhead-press': OverheadPress,
  'incline-dumbbell-press': InclineDBPress,
  dips: Dips,
  'triceps-pushdown': TricepsPushdown,
  deadlift: Deadlift,
  'pull-up': PullUp,
  'barbell-row': BarbellRow,
  'lat-pulldown': LatPulldown,
  'romanian-deadlift': RomanianDeadlift,
  'leg-press': LegPress,
  'bulgarian-split-squat': BulgarianSplitSquat,
  'standing-calf-raise': StandingCalfRaise,
  plank: Plank,
  'hanging-leg-raise': HangingLegRaise,
  'ab-wheel-rollout': ABWheelRollout,
  'stationary-cycling': StationaryCycling,
  'hip-thrust': HipThrust,
  'preacher-curl': PreacherCurl,
  'hammer-curl': HammerCurl,
  'leg-extension': LegExtension,
  'jump-rope': JumpRope,
  'cable-fly': CableFly,
  'cable-kickback': CableKickback,
  'close-grip-bench-press': CloseGripBenchPress,
  'diamond-push-up': DiamondPushUp,
  'front-raise': FrontRaise,
  'glute-bridge': GluteBridge,
  'incline-dumbbell-curl': InclineDumbbellCurl,
  'lateral-raise': LateralRaise,
  'leg-curl': LegCurl,
  'overhead-tricep-extension': OverheadTricepExtension,
  'push-up': PushUp,
  'russian-twist': RussianTwist,
  'seated-row': SeatedRow,
  'skull-crusher': SkullCrusher,
  'sumo-deadlift': SumoDeadlift,
};

export function getExerciseSvg(slug: string): React.FC<SvgProps> | null {
  return exerciseMap[slug] ?? null;
}
