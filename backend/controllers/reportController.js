// import { Report } from '../models/report.js';


// export const getAllReports = async(req,res) => {
//     await Report.find({})
//     .then((reports) => {
//         res.status(200).json(reports);
//     })
//     .catch((e) => {
//         console.log(`Error: ${e}`);
//         res.status(400).json({message:'Server error'})
//     })
// }


// export const getReport = async(req,res) => {
//     const reportId = req.params.reportId;

//     if(!reportId){
//         res.status(500).json({message:'No report id was provided'})
//     }else{
//         await Report.findById(reportId)
//         .then((report) => {
//             res.status(200).json(report);
//         })
//         .catch((error) => {
//             console.log(`Error: ${error}`);
//             res.status(400).json({message:'Server error'})
//         })
//     }
// }


// export const updateReport = async(req,res) => {
//     const reportId = req.params.reportId;
//     const status = req.body.status;

//     if (!reportId && !status){
//         res.status(500).json({message:'No report id and status was provided'})
//     }else{
//         try{
//             if (status == 'Resolved' || status == 'Pending'){
//                 const report = await Report.findByIdAndUpdate(reportId, req.body, {new: true});
//                 return res.status(200).json(report);
//             } else {
//                 return res.status(400).json({message: 'Invalid request'});
//             }
//         }
//         catch(error){
//             console.log(`Error: ${error}`);
//             res.status(400).json({message:'Server error'})
//         }
//     }
// }


// export const deleteReport = async(req,res) => {
//     const reportId = req.query.reportId;

//     if(!reportId){
//         res.status(500).json({message:'No report id was provided'})
//     }else{
//         await Report.findByIdAndDelete(reportId)
//         .then(() => {
//             res.status(200).json({'message':'Report deleted successfully'});
//         })
//         .catch((error) => {
//             console.log(`Error: ${error}`);
//             res.status(400).json({message:'Server error'})
//         })
//     }
// }