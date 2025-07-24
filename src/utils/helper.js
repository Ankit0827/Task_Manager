

export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const validateFullName = (name) => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name);
};

export const validateSixDigitNumber = (input) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(String(input));
};



export const addThousandsSeparator=(num)=>{
  
    if(num==null || isNaN(num)) return ;

    const [integerPart,fractionPart]=num.toString().split(".");

    const formattedInteger=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,".");

    return fractionPart ? `${formattedInteger}.${fractionPart}`:formattedInteger;
}