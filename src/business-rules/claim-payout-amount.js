
export const isPotentiallyRepairable = (claimEventTypes, eventTypeName) => {
  if (!eventTypeName) {
    return true
  }
  if (claimEventTypes.length < 1) {
    return true
  }
  const repairableEventTypes = claimEventTypes.filter(type => type.is_repairable)
  return repairableEventTypes.some(type => type.name === eventTypeName)
}
