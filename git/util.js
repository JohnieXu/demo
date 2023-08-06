const getTimezone = () => {
  const zone = new Date().getTimezoneOffset()/60
  if (zone > 0) {
    if ((zone + '').length > 1) {
      return `-${zone}00`
    }
    return `-0${zone}00`
  } else {
    if ((zone + '').length > 1) {
      return `+${zone}00`
    }
    return `+0${zone}00`
  }
}

module.exports = {
  getTimezone
}
