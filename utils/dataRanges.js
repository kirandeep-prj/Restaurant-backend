exports.getTodayRange =()=>{
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    return {start, end};
};

exports.getWeeklyRange = ()=>{
    const start= new Date();
    const end = new Date();
    start.setDate(end.getDate()-7);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    return {start,end};
};

exports.getMonthlyRange = ()=>{
    const start=new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    );
    const end = new Date();
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    return {start,end};
}