const _ = require('lodash')
const storiesModel = require('./../models/storiesModels')
const usersModels = require('./../models/usersModels')

const controllers = {
    listAllStories : (req,res) => {
        storiesModel.find()
            .then(result => {    
                let storydata = result 
                console.log(storydata)    
                
                console.log(req.session)
                usersModels.find()
                .then(userResults => {
                    console.log(userResults)
                    res.render('stories/index', {
                        userdata : userResults,
                        data: storydata,
                        title : "All"
                        
                    })

                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/stories')
                })
            })
    },
    newStories: (req, res) => {
        res.render('stories/new', {
            title: "Enter your blog Post"
        })
    },
    selectedStories : (req,res) => {
        let id = req.params.id

        storiesModel.findOne({
            _id:id
        })
            .then(result => {
                if(!result) {
                    res.redirect('/stories')
                    return
                }
                res.render('stories/show', {
                    data : result,
                })

            })
            .catch(err => {
                console.log(err)
                res.redirect('/stories')
            })
    },
    createStories : (req,res) => {
        
        const id = _.kebabCase(req.params.id)

        storiesModel.create({
            created_by: req.session.user._id,
            title: req.body.Title,
            story: req.body.Story,

        })
            .then(result => {
                res.redirect('/stories/' + result._id)
            })
            .catch(err => {
                console.log(err)
                res.redirect('/stories/new')
            })
    },
    editStories : (req,res) => {
        const id = req.params.id

        storiesModel.findOne({
            _id:id
        })
            .then(result => {
                res.render('stories/edit', {
                    title: "Edit: " + result.title,
                    data:result,
                    id:result._id
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/stories/new')
            })
    },
    updateStories : (req,res) => {
        const id = req.params.id
        var d = new Date()
        newDate = d.toDateString()

        storiesModel.findOne({
            _id:id
        })
            .then(result => {

                storiesModel.update(
                    {
                        _id:id
                    },
                    {   
                        created_at: newDate,
                        title:req.body.Title,
                        story:req.body.Story,
                    }
                )
                    .then(dateResult => {
                        res.redirect('/stories/' + id)
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/stories')
                    })
            })

    },
    deleteStories : (req,res) => {
        storiesModel.findOne(
            {
                    _id: req.params.id
            }
        )
            .then(result => {

                storiesModel.deleteOne({
                    _id: req.params.id
                })
                    .then(deleteResult => {
                        res.redirect('/stories')
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/stories')
                    })

            })
            .catch(err => {
                console.log(err)
                res.redirect('/stories')
            })

    },

    showInfo : (req,res) => {

        storiesModel.find()

            .then(results => {
                res.render('stories/info', {
                    title : "Info Page",
                    data : results
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/stories')
                
            })


    }

}

module.exports = controllers







// const controllers = {
//     listAllStories : (req,res) => {
//         storiesModel.find()
//             .then(results => {
//                 res.render('stories/index', {
//                     title : "All the Stories so Far",
//                     data : results
//                 })
                
//                 usersModels.find()
//                 .then(userResults => {
//                     res.render('stories/index', {
//                         userdata : userResults
//                     })
//                 })
//                 .catch(err => {
//                     console.log(err)
//                     res.redirect('/stories')
//                 })
//             })
//     },