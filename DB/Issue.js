class Issue{
    constructor(title, content, progress){
        this.title = title;
        this.content = content;
        this.progress = parseInt(progress);
        this.id = Math.floor(Math.random()*(1001-1)+1);
        this.date = Date.now();
    }
}

module.exports = Issue;