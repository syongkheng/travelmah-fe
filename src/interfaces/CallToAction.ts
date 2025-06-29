interface CallToAction {
  label: string
  handler: () => void
  variant: 'primary' | 'success' | 'warning' | 'default' | 'info' | 'danger'
}

interface StepCTA extends CallToAction {
  icon?: object
}

const defaultCta: CallToAction = {
  label: 'Click me!',
  handler: () => console.log('Clicked'),
  variant: 'default',
}

export { defaultCta }
export type { CallToAction, StepCTA }
