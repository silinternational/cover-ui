<script lang="ts">
import user, { attachUserPhoto, updateUser } from '../../authn/user'
import { Breadcrumb, CountrySelector, FileDropArea, RadioOptions } from 'components'
import { upload } from 'data'
import { policies } from 'data/policies'
import { assertEmailAddress } from '../../validation/assertions'
import { formatPageTitle } from 'helpers/pageTitle'
import { SETTINGS_PERSONAL } from 'helpers/routes'
import { metatags } from '@roxi/routify'
import { Button, Checkbox, TextField, Page, setNotice } from '@silintl/ui-components'
import Croppie from 'croppie'
import 'croppie/croppie.css'

const NOTIFICATION_OPTION_DEFAULT = 'default_email'
const NOTIFICATION_OPTION_CUSTOM = 'custom_email'

let uploading = false
let notification_email = $user.email_override ? NOTIFICATION_OPTION_CUSTOM : NOTIFICATION_OPTION_DEFAULT
let email_override = $user.email_override || ''
let country = $user.country || ''
let croppie: Croppie
let croppieContainer: HTMLDivElement
let breadcrumbLinks = [{ name: 'Personal Settings', url: SETTINGS_PERSONAL }]
metatags.title = formatPageTitle('Personal Settings')

$: notificationOptions = [
  { label: 'Default email: ' + $user.email, value: NOTIFICATION_OPTION_DEFAULT },
  { label: 'Custom email', value: NOTIFICATION_OPTION_CUSTOM },
]

const updateCustomEmail = async () => {
  assertEmailAddress(email_override, 'Please enter a valid email address')

  await updateUser({
    email_override,
    country,
  })
  setNotice('Your notification email has been saved')
}

const updateCountry = async (event: CustomEvent) => {
  country = event.detail
  await updateUser({
    email_override,
    country,
  })
  setNotice('Your country has been saved')
}

const handleChecked = (policyId: string) => {
  setNotice('Notification option has been saved')
}

const handleUnchecked = (policyId: string) => {
  setNotice('Notification option has been saved')
}

async function onFileSelect(event: CustomEvent<FormData>) {
  croppie =
    croppie ||
    new Croppie(croppieContainer, {
      viewport: { width: 128, height: 128, type: 'circle' },
    })

  let file = event.detail.get('file') as File

  if (file) {
    let reader = new FileReader()
    reader.onload = (e) => {
      croppie.bind({
        url: e.target.result as string,
      })
    }

    reader.readAsDataURL(file)
  }
}

async function onUpload() {
  if (!croppie) {
    setNotice('Please select an image to upload')
  } else {
    try {
      uploading = true

      croppie.result({ type: 'blob', circle: true }).then(async (result) => {
        let data = new FormData()
        data.append('file', result)

        const file = await upload(data)

        await attachUserPhoto(file.id)

        setNotice('Your profile photo has been updated')
      })
    } catch {
      setNotice('There was an error uploading your profile photo')
    } finally {
      uploading = false
    }
  }
}
</script>

<style>
p {
  margin-top: 2rem;
}

.photo-preview {
  width: 300px;
  height: 300px;
  padding-bottom: 40px;
}
</style>

<Page>
  <Breadcrumb links={breadcrumbLinks} />

  <p>
    <span class="header">Notification email</span>
    <RadioOptions name="notificationEmail" options={notificationOptions} bind:value={notification_email} />
  </p>
  {#if notification_email === NOTIFICATION_OPTION_CUSTOM}
    <TextField placeholder={'Custom email'} bind:value={email_override} on:blur={updateCustomEmail} />
  {/if}

  <p>
    <span class="header">Primary Location<span class="required">*</span></span>
    <CountrySelector on:chosen={updateCountry} {country} />
  </p>

  {#if 0}
    <p>
      <span class="header">Receive notification emails for</span>
      {#each $policies as policy (policy.id)}
        <Checkbox
          label={policy.type}
          checked
          on:checked={() => handleChecked(policy.id)}
          on:unchecked={() => handleUnchecked(policy.id)}
        />
      {/each}
    </p>
  {/if}

  <p>
    <span class="header">Profile picture</span>
    <FileDropArea mimeType="image/*" class="w-50 mt-10px" raised {uploading} on:upload={onFileSelect} />
  </p>

  <div class="photo-preview">
    <div bind:this={croppieContainer} />
  </div>
  {#if croppie}
    <Button raised on:click={onUpload}>Save</Button>
  {/if}
</Page>
