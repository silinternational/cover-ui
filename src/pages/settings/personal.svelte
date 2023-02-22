<script lang="ts">
import { Breadcrumb, CountrySelector, FilePreview, RadioOptions, RemoveProfilePicModal } from 'components'
import { MAX_INPUT_LENGTH as maxlength } from 'components/const'
import { upload } from 'data'
import user, { attachUserPhoto, deleteUserPhoto, updateUser } from 'data/user'
import { formatPageTitle } from 'helpers/pageTitle'
import { SETTINGS_PERSONAL } from 'helpers/routes'
import { assertEmailAddress } from '../../validation/assertions'
import Croppie from 'croppie'
import 'croppie/croppie.css'
import { metatags } from '@roxi/routify'
import { Button, FileDropArea, TextField, Page, setNotice } from '@silintl/ui-components'

const NOTIFICATION_OPTION_DEFAULT = 'default_email'
const NOTIFICATION_OPTION_CUSTOM = 'custom_email'

let email_override: string
let notification_email: string
let uploading = false
let croppie: Croppie
let croppieContainer: HTMLDivElement
let breadcrumbLinks = [{ name: 'Personal Settings', url: SETTINGS_PERSONAL }]
let croppieIsHidden = true
let open = false

metatags.title = formatPageTitle('Personal Settings')

$: country = $user.country || ''
$: $user.id && setEmail()
$: notificationOptions = [
  { label: 'Default email: ' + $user.email, value: NOTIFICATION_OPTION_DEFAULT },
  { label: 'Custom email', value: NOTIFICATION_OPTION_CUSTOM },
]

function onSave() {
  setNotice('Changes are saved after each change')
}

const setEmail = () => {
  if ($user.email_override !== $user.email) {
    email_override = $user.email_override || ''
  }
  notification_email = email_override ? NOTIFICATION_OPTION_CUSTOM : NOTIFICATION_OPTION_DEFAULT
}

const updateCustomEmail = async () => {
  assertEmailAddress(email_override, 'Please enter a valid email address')

  await updateUser({
    email_override,
    country,
  })
  setNotice('Your notification email has been saved')
}

const updateEmailSelection = async () => {
  if (notification_email === NOTIFICATION_OPTION_DEFAULT) {
    email_override = ''
    await updateUser({
      email_override: $user.email,
      country,
    })
  }
}

const updateCountry = async (event: CustomEvent) => {
  country = event.detail
  await updateUser({
    email_override,
    country,
  })
  setNotice('Your country has been saved')
}

async function onFileSelect(event: CustomEvent<FormData>) {
  croppieIsHidden = false
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
        url: e.target?.result as string,
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
      croppieIsHidden = true
    }
  }
}

function onDelete(e: CustomEvent) {
  if (e.detail === 'remove') {
    deleteUserPhoto()

    setNotice('Your profile photo has been deleted')
  }
  open = false
}

function openPhoto() {
  window.open($user.photo_file?.url, '_blank')
}
</script>

<style>
p {
  margin-top: 2rem;
}
.croppieIsHidden {
  display: none;
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
    <RadioOptions
      name="notificationEmail"
      options={notificationOptions}
      bind:value={notification_email}
      on:change={updateEmailSelection}
    />
  </p>
  {#if notification_email === NOTIFICATION_OPTION_CUSTOM}
    <TextField {maxlength} label="Custom email" bind:value={email_override} on:blur={updateCustomEmail} />
  {/if}

  <p>
    <span class="header">Primary Location<span class="required-input">*</span></span>
    <CountrySelector on:chosen={updateCountry} {country} />
  </p>

  <p>
    <span class="header">Profile picture</span>
    <FileDropArea mimeType="image/*" class="w-50 mt-10px" raised {uploading} on:upload={onFileSelect} />
  </p>

  <div class="photo-preview" class:croppieIsHidden>
    <div bind:this={croppieContainer} />
  </div>

  {#if $user.photo_file?.id}
    <FilePreview
      label="Profile Picture — {($user.photo_file?.size / 1000).toFixed(2)}kb"
      allowDelete
      on:deleted={() => (open = true)}
      on:click={openPhoto}
    />
  {/if}

  {#if !croppieIsHidden}
    <Button raised on:click={onUpload}>save</Button>
  {/if}

  <RemoveProfilePicModal {open} on:closed={onDelete} />

  <Button raised on:click={onSave}>save changes</Button>
</Page>
