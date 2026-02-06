const applyDiscount = (totalAmount) =>{
    let discountAmount = 0;

    if(totalAmount >= 1000){
        discountAmount = totalAmount * 0.10;
    }
    else if(totalAmount >=500){
        discountAmount = totalAmount * 0.05;
    }
    else{
        discountAmount = totalAmount * 0.02;
    }

    return{
        discountAmount:Math.round(discountAmount),
        finalAmount:totalAmount - Math.round(discountAmount),
    };
};

module.exports = applyDiscount;