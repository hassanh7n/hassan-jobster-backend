const express = require('express')
const router = express.Router()
const testUser = require('../middleware/testUser')



const  {
    createJob,
    updateJob,
    deleteJob,
    getAllJobs,
    getSingleJobs,
    showStats
} = require('../controllers/Jobs');



router.route('/').post(testUser,createJob).get(getAllJobs);
router.route('/stats').get(showStats)
router.route('/:id').get(getSingleJobs).delete(testUser,deleteJob).patch( testUser,updateJob);



module.exports = router