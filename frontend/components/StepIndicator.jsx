
import React from 'react';

export default function StepIndicator({ currentStep, totalSteps }) {
  const steps = [
    { id: 1, label: 'Class' },
    { id: 2, label: 'Stream' },
    { id: 3, label: 'Subject' },
    { id: 4, label: 'Focus' },
  ];

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="step-container">
      <div className="step-line"></div>
      <div className="step-line-active" style={{ width: `${progress}%` }}></div>

      {steps.map((step) => (
        <div key={step.id} className="step-item">
          <div className={`step-circle ${currentStep >= step.id ? 'active' : ''}`}>
            {currentStep > step.id ? '✓' : step.id}
          </div>
          <span className={`step-label ${currentStep === step.id ? 'active' : ''}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
