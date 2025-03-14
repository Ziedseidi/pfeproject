const roleMiddleware=(...roles)=>{
    return(req, res, next)=>{
        if(!req.user||  !req.user.role|| !req.user.role.nom){
            return res.status(403).json({message:"Accés interdit. Roleinsuffisant."});
        }

        next();
    };
};


module.exports=roleMiddleware;