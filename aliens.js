const userLocale = getUserLocale()


$( document ).ready( () => {
  utcToUserTime()
} )


function getUserLocale () {
  if ( navigator.languages != undefined ) {
    return navigator.languages[ 0 ]
  } else if ( navigator !== undefined )  {
    return navigator.language.split( ',' )[ 0 ]
  } else {
    return 'en-US'
  }
}


function utcToUserTime () {
  // only check time tags with the utc class
  for ( const timeElement of $( `#aliens time.utc` ) ) {
    // remove the utc class so that when this function is called in the future
    // already converted times won't be converted again
    timeElement.outerHTML = '<time>' + utcToUserTimeStamp( timeElement.innerHTML ) + '</time>'
  }
}


// expects a valid timestamp such as 2020-04-10 13:59:57
function utcToUserTimeStamp ( utcTimeStamp, locale = userLocale ) {
  const now = new Date()

  const diffYear = now.getFullYear() - now.getUTCFullYear()
  const diffMonth = now.getMonth() - now.getUTCMonth()
  const diffDate = now.getDate() - now.getUTCDate()
  const diffHours = now.getHours() - now.getUTCHours()
  const diffMinutes = now.getMinutes() - now.getUTCMinutes()

  const zeroDate = new Date( 0, 0, 0, 0, 0, 0, 0 )
  const utcDiffDate = new Date( diffYear, diffMonth, diffDate, diffHours, diffMinutes, 0, 0 )

  // get the difference from current user time to UTC time in microseconds
  const diffTimeStamp = utcDiffDate.getTime() - zeroDate.getTime()

  const inputDate = new Date( utcTimeStamp )
  const inputTimeStamp = inputDate.getTime()
  const localTimeStamp = inputTimeStamp + diffTimeStamp
  const outputDate = new Date( localTimeStamp )
  const output = outputDate.toLocaleDateString( locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } ) + ', ' + outputDate.toLocaleTimeString( locale, {
    hour: 'numeric',
    minute: 'numeric',
  } )

  return output
}


function showTraits ( id ) {
  $( `#alien${ id } .image:first` ).css( 'display', 'none' )
  $( `#alien${ id } .traits:first` ).css( 'display', 'block' )
}


function hideTraits ( id ) {
  $( `#alien${ id } .image:first` ).css( 'display', 'block' )
  $( `#alien${ id } .traits:first` ).css( 'display', 'none' )
}


function toggleTraits ( id ) {
  if ( $( `#alien${ id } .traits` ).css( 'display' ) === 'none' ) {
    console.log( 'SHOW TRAITS', id, `#alien${ id }`, `#alien${ id } .image`, `#alien${ id } .traits`, $( `#alien${ id } .image` ) )
    showTraits( id )
  } else {
    console.log( 'HIDE TRAITS', id, `#alien${ id }`, `#alien${ id } .image`, `#alien${ id } .traits`, $( `#alien${ id } .image` ) )
    hideTraits( id )
  }
}
