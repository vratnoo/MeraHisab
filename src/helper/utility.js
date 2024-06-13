export const getDay = (item)=>{
    const date = new Date(item)
    const day  = date.toLocaleDateString('en-us', {weekday: 'short' });
    const localDate  = date.toLocaleDateString('en-in');
    return localDate+" "+day
    
}


export const getDate = (item)=>{
    const date = new Date(item)
    return date.toISOString().slice(0, 10)
    
}

export function isValidDate(d) {
    return Number.isNaN(Date.parse(d)) === false;
  }


export const todayDate = ()=>{
    const today = new Date().toISOString().slice(0, 10)
    console.log("Date check is here",new Date(today).toISOString())
    return new Date(today).toISOString()
}
