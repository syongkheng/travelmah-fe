import type { FormRules } from 'element-plus'

export function getPlanFormRulesManager() {
  const formRules: FormRules = {
    title: [
      { required: true, message: 'Please input name', trigger: 'blur' },
      { min: 3, max: 50, message: 'Length should be 3 to 50', trigger: 'blur' },
    ],
  }

  const isValidTitle = (title: string): boolean => {
    return title.length >= 3 && title.length <= 50
  }

  return { formRules, isValidTitle }
}
