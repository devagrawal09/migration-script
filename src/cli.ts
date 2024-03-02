
import * as p from '@clack/prompts'
import color from 'picocolors'
import { checkIfFileExists, createValidatorOptions, getFileType } from './functions'
import { VALIDATORS } from './envs-constants'


export const runCLI = async () => {
  p.intro(`${color.bgCyan(color.black('Clerk User Migration Utility'))}`)

  const options = createValidatorOptions()

  const args = await p.group(
    {
      source: () =>
        p.select({
          message: 'What platform are you migrating your users from?',
          initialValue: options[0].value,
          maxItems: 1,
          options: options
        }),
      file: () =>
        p.text({
          message: 'Specify the file to use for importing your users',
          initialValue: 'users.json',
          placeholder: 'users.json',
          validate: (value) => {
            if (!checkIfFileExists(value)) {
              return "That file does not exist. Please try again"
            }
            if (getFileType(value) !== 'text/csv' && getFileType(value) !== 'application/json') {
              return 'Please supply a valid JSON or CSV file'
            }
          }
        }),
      instance: () =>
        p.select({
          message: 'Are you importing your users into a production instance? Development instances are for testing and limited t0 500 users.',
          initialValue: 'prod',
          maxItems: 1,
          options: [
            { value: 'prod', label: 'Prodction' },
            { value: 'dev', label: 'Developetion' }
          ]
        }),
      offset: () =>
        p.text({
          message: 'Specify an offset to begin importing from.',
          defaultValue: '0',
          placeholder: '0'
        }),
      begin: () =>
        p.confirm({
          message: 'Begin Migration?',
          initialValue: true,
        }),
    },
    {
      onCancel: () => {
        p.cancel('Migration cancelled.');
        process.exit(0);
      },
    }
  )

  if (args.begin) {
    console.log('Migration started')
  }


  return args

}

