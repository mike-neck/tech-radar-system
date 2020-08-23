export enum TechAssessment {
    Adopt,
    Trial,
    Assess,
    Hold,
}

export function techAssessmentAsString(assessment: TechAssessment): string {
    switch (assessment) {
        case TechAssessment.Adopt:
            return "Adopt";
        case TechAssessment.Trial:
            return "Trial";
        case TechAssessment.Assess:
            return "Assess";
        case TechAssessment.Hold:
            return "Hold";
    }
}

export function techAssessments(): [TechAssessment, TechAssessment, TechAssessment, TechAssessment] {
    return [
        TechAssessment.Adopt,
        TechAssessment.Trial,
        TechAssessment.Assess,
        TechAssessment.Hold,
    ];
}

export function leftIsMorePracticalThanRight(left: TechAssessment, right: TechAssessment): boolean {
    return left < right;
}

export function previousTechAssessmentOf(assessment: TechAssessment): TechAssessment {
    switch (assessment) {
        case TechAssessment.Adopt: return TechAssessment.Hold;
        case TechAssessment.Trial: return TechAssessment.Adopt;
        case TechAssessment.Assess: return TechAssessment.Trial;
        case TechAssessment.Hold: return TechAssessment.Assess;
    }
}
