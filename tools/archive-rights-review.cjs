'use strict';
function prepareArchiveReview(record){
 if(!record||typeof record!=='object'||Array.isArray(record))throw Error('Invalid archive record');
 const rights=typeof record.rights==='string'?record.rights.trim():'';
 return Object.freeze({title:record.title,sourceUrl:record.url,classification:record.classification,linkOnly:true,redistributionApproved:false,requiresRightsReview:true,requiresSourceVerification:record.classification!=='Documented',issues:Object.freeze([...(!rights?['missing rights note']:[]),...(!record.reviewed?['missing review date']:[])])});
}
module.exports={prepareArchiveReview};
