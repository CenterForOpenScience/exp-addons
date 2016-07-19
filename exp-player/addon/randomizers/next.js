var randomizer = function(frame, pastSessions, resolveFrame) {
    pastSessions = pastSessions.filter(function(session) {
        return session.get('conditions');
    });
    pastSessions.sort(function(a, b) {
        return a.get('createdOn') > b.get('createdOn') ? -1: 1;
    });
    
    var option = null;
    if(pastSessions.length) {
        var lastChoice = (pastSessions[0].get(`conditions.${frame.id}`) || frame.options)[0];
        var offset = frame.options.indexOf(lastChoice) + 1;
        option = frame.options.concat(frame.options).slice(offset).unshift();
    }
    else {
        option = frame.options.unshift();
    }
    var [frames,] = resolveFrame(option);
    return [frames, option];
};
export default randomizer;
