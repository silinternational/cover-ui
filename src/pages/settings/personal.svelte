<script lang="ts">
    import user, { updateUser } from '../../authn/user'
    import { Breadcrumb, FileDropArea, RadioOptions } from "../../components"
    import { upload } from '../../data'
    import { policies, init as loadPolicies } from '../../data/policies'
    import { Button, Checkbox, TextField, Page, Snackbar, setNotice } from "@silintl/ui-components"
    import Croppie from "croppie"
    import "croppie/croppie.css"
    
    const NOTIFICATION_OPTION_DEFAULT = "default_email"
    const NOTIFICATION_OPTION_CUSTOM = "custom_email"

    let uploading = false
    let notification_email = $user.email_override ? NOTIFICATION_OPTION_CUSTOM : NOTIFICATION_OPTION_DEFAULT
    let email_override = $user.email_override || ''
    let location = $user.location || ''
    let croppie: Croppie

    $: notificationOptions = [
        { label: "Default email: " + $user.email, value: NOTIFICATION_OPTION_DEFAULT },
        { label: "Custom email", value: NOTIFICATION_OPTION_CUSTOM }
    ]

    $: $policies.length || loadPolicies()
    
    const updateNotificationSelection = () => {
        console.log('updated updateNotificationSelection');
    }
    const updateCustomEmail = async () => {
      if (isEmailValid(email_override)) {
        await updateUser({
          ...$user,
          email_override
        })
        setNotice('Your notification email has been saved')
      } else {
        setNotice('Please enter a valid email address')
      }
    }
    
    const updateLocation = async () => {
      if (isLocationValid(location)) {
        await updateUser({
          ...$user,
          location
        })
        setNotice('Your location has been saved')
      } else {
        setNotice('Please enter a location')
      }
    }

    const handleChecked = (policyId: string) => {
      setNotice('Notification otpion has been saved')
    }

    const handleUnchecked = (policyId: string) => {
      setNotice('Notification otpion has been saved')
    }

    async function onFileSelect(event: CustomEvent<FormData>) {
      croppie = croppie || new Croppie(document.getElementById('croppie-container'), {
        viewport: { width: 128, height: 128, type: 'circle' }
      })

      let file = event.detail.get('file') as File

      if (file) {
        let reader = new FileReader()
        reader.onload = e => {
          croppie.bind({
            url: e.target.result as string
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

            croppie.result({ type: 'blob', circle: true }).then(async result => {
              let data = new FormData()
              data.append('file', result)

              const file = await upload(data)

              updateUser({
                ...$user,
                photo_file: {
                  content_type: file.content_type,
                  created_by_id: $user.id,
                  id: file.id,
                  name: file.filename,
                  size: file.size,
                  url: file.url,
                  url_expiration: undefined
                },
                photo_file_id: file.id
              })

              setNotice('Your profile photo has been updated')
            })
          } catch {
            setNotice('There was an error uploading your profile photo')
          } finally {
              uploading = false
        }
      }
    }

    // const updateHouseholdId = async () => {
    //   householdId = householdId.replaceAll(' ', '')
    //   if(householdId !== policy.household_id) {
    //     if(isIdValid(householdId)) {
    //       await callUpdatePolicy(householdId)
    
    //       setNotice('Your household ID has been saved')
    //     } else {
    //       setNotice('Please enter a valid Household ID')
    //     }
    //   }
    // }
    
    // const updateCostCenter = async () => {
    //   costCenter = costCenter.replaceAll(' ', '')
    //   if(costCenter !== policy.cost_center) {
    //     if(isIdValid(costCenter)) {
    //       await callUpdatePolicy(householdId, costCenter)
    
    //       setNotice('Your cost center has been saved')
    //     } else {
    //       setNotice('Please enter a valid cost center')
    //     }
    //   }
    // }
    
    // const updateAffiliation = async e => {
    //   const choice = e.detail
    
    //   if(choice !== policyData.entity_code) {
    //     await callUpdatePolicy(householdId, costCenter, choice)
        
    //     setNotice('Your affiliation has been saved')
    //   }
    // }
    
    // const callUpdatePolicy = async (id: string, costCenter: string = undefined, affiliation: string = undefined) => {
    //   policyData.household_id = id
    //   affiliation && (policyData.entity_code = affiliation)
    //   costCenter && (policyData.cost_center = costCenter)
    
    //   await updatePolicy(policyId, policyData)
    // }
    
    const isEmailValid = (email: string) => email.includes('@') // bare basic validation
    const isLocationValid = (location: string) => !!location
    // const isIdValid = sanitizedId => sanitizedId.length && sanitizedId.split('').every(digit => /[0-9]/.test(digit))
    // const edit = id => $goto(`/settings/household/dependent/${id}`)
    // const isYou = householdMember => householdMember.id === $user.id
    </script>
    
    <style>
    .required {
      color: var(--mdc-theme-status-error);
    }

    .photo-preview {
      width: 300px;
      height: 300px;
      padding-bottom: 40px;
    }
    </style>
    
    <Page>
      <Breadcrumb />
    
      <h3 class="ml-1 mt-3">Notification email</h3>
      <p>
          {notification_email}
          <RadioOptions name="notificationEmail" options={notificationOptions} bind:value={notification_email} ></RadioOptions>
      </p>
      {#if notification_email === NOTIFICATION_OPTION_CUSTOM }
      <TextField placeholder={'Custom email'} bind:value={email_override} on:blur={updateCustomEmail} ></TextField>
      {/if}

      <h3 class="ml-1 mt-3">Location<span class="required">*</span></h3>
      <p>
        <TextField placeholder={'Enter country'} bind:value={location} on:blur={updateLocation} />
      </p>

      <h3 class="ml-1 mt-3">Receive notification emails for</h3>
      <p>
          {#each $policies as policy (policy.id) }
          <Checkbox label={policy.type} checked={true} on:checked={handleChecked(policy.id)} on:unchecked={handleUnchecked(policy.id)} ></Checkbox>
          {/each}
      </p>

      <h3 class="ml-1 mt-3">Profile picture</h3>
      <p>
          <FileDropArea mimeType="image/*" class="w-50 mt-10px" raised {uploading} on:upload={onFileSelect} />
      </p>
      
      <div class="photo-preview">
        <div id="croppie-container"></div>
      </div>
      {#if croppie}
      <Button raised on:click={onUpload}>Save</Button>
      {/if}
      <Snackbar/>
    </Page>
    