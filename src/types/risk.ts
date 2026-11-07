export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export type LikelihoodScale = 1 | 2 | 3 | 4 | 5;
export type ImpactScale = 1 | 2 | 3 | 4 | 5;

export type RiskCategory = 'PEOPLE' | 'SYSTEM' | 'PROCESS' | 'EXTERNAL';

export type ControlType = 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE';

export type ControlEffectiveness = 'STRONG' | 'ADEQUATE' | 'WEAK' | 'NONE';

export type ActionPlanStrategy = 'TREAT' | 'TRANSFER' | 'TOLERATE' | 'TERMINATE';

export type RiskStatus = 'OPEN' | 'IN_PROGRESS' | 'MITIGATED' | 'CLOSED';

export interface RiskItem {
  id: string;
  code: string;
  title: string;
  department: string;
  category: RiskCategory;
  cause: string;
  event: string;
  impactDescription: string;
  inherentLikelihood: LikelihoodScale;
  inherentImpact: ImpactScale;
  inherentScore: number;
  inherentLevel: RiskLevel;
  existingControls: string;
  controlType: ControlType;
  controlEffectiveness: ControlEffectiveness;
  residualLikelihood: LikelihoodScale;
  residualImpact: ImpactScale;
  residualScore: number;
  residualLevel: RiskLevel;
  actionPlan: string;
  actionStrategy: ActionPlanStrategy;
  actionOwner: string;
  actionDeadline: string;
  status: RiskStatus;
  createdAt: string;
  updatedAt: string;
}

export type KRIStatus = 'GREEN' | 'AMBER' | 'RED';

export interface KRIItem {
  id: string;
  code: string;
  name: string;
  category: RiskCategory;
  metricUnit: string;
  currentValue: number;
  greenThreshold: number;
  amberThreshold: number;
  redThreshold: number;
  comparator: '<' | '>'; // '<' means lower is better, '>' means higher is better
  status: KRIStatus;
  lastUpdated: string;
  targetRiskCode?: string;
  description: string;
}

export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  risks: Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'>[];
  kris: Omit<KRIItem, 'id' | 'lastUpdated'>[];
}
