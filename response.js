const response = (stat,data,pesan,res) => {
    res.status(stat).json({
    payload:{
        statusKode:stat,
        data:data,
        pesan :pesan
    }
    })
}
module.exports = response