export const FormatDate = ({ dt, format, asDate = false }) => {
    if (!dt) {
      return dt; // Devuelve null, undefined u otra entrada falsy sin cambios
    }
  
    // Ajusta el formato de entrada DD-MM-YYYY a MM/DD/YYYY
    const adjustedDate = dt.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3');
  
    const date = new Date(adjustedDate);
  
    if (isNaN(date.getTime())) {
      return dt; // Devuelve la entrada original si la fecha no es válida
    }
  
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
  
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
  
    switch (format) {
      case 'YYYY-MM-DD':
        return asDate ? new Date(year, month - 1, day) : `${year}-${month}-${day}`;
      case 'MM-DD-YYYY':
        return asDate ? new Date(year, month - 1, day) : `${month}-${day}-${year}`;
      case 'DD-MM-YYYY':
        return asDate ? new Date(year, month - 1, day) : `${day}-${month}-${year}`;
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'DD-MM-YYYY HH:mm:ss':
        return asDate
          ? new Date(year, month - 1, day, hours, minutes, seconds)
          : `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      default:
        return asDate ? date : `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
    }
};  

export const ToDay = ({ format = 'default', asDate = false } = {}) => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    switch (format) {
      case 'YYYY-MM-DD':
        return asDate ? new Date(year, month - 1, day) : `${year}-${month}-${day}`;
      case 'MM-DD-YYYY':
        return asDate ? new Date(year, month - 1, day) : `${month}-${day}-${year}`;
      case 'DD-MM-YYYY':
        return asDate ? new Date(year, month - 1, day) : `${day}-${month}-${year}`;
      default:
        return asDate ? new Date(year, month - 1, day) : `${day}-${month}-${year}`;
    }
};

export const Currency = (amount) => {
    if (amount !== null && amount !== undefined && !isNaN(amount)) {
        const numericAmount = parseFloat(amount);

        // Redondear el número a dos decimales
        const roundedAmount = Math.round(numericAmount * 100) / 100;

        // Separar la parte entera y la parte decimal
        const [integerPart, decimalPart] = roundedAmount.toString().split('.');

        // Formatear la parte entera con puntos cada tres dígitos desde atrás hacia adelante
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Unir la parte entera y la parte decimal
        const formattedAmount = decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;

        return formattedAmount;
    } else {
        return amount;
    }
}

export const IsMail = (mail) => {
  try{
    const _exp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return _exp.test(mail);
  }catch(error){
    return false;
  }
}

export const FormatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
