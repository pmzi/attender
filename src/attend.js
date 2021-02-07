const puppeteer = require('puppeteer-extra')

class LMSDriver {
    browser = null;
    page = null;
    link = null;
    username = null;
    password = null;
    loginPage = null;
    classPage = null;

    constructor({ link, username, password, loginPage }){
        this.link = link;
        this.username = username;
        this.password = password;
        this.loginPage = loginPage;
    }
    
    async bootstrap(){
        this.browser = LMSDriver.userBrowsers[this.username] ?? await puppeteer.launch({ headless: false, product: 'firefox' });

        LMSDriver.userBrowsers[this.username] = this.browser;

        this.page = await this.browser.newPage();
    }

    async isLoggedIn(){
        await this.page.goto(this.loginPage, { waitUntil: 'load' });
        const usernameFiled = await this.page.$('#username');
        return !usernameFiled;
    }
    
    async login(){
        await this.page.goto(this.loginPage, { waitUntil: 'load' });
        await this.page.type('#username', this.username);
        await this.page.type('#password', this.password);
        await this.page.click('#username');
        await this.page.click('#loginbtn');
        await this.page.waitForNavigation({
            waitUntil: 'domcontentloaded',
        });
    }

    async attend(){
        await this.page.goto(this.link, { waitUntil: 'domcontentloaded' });

        const onClick = await this.page.evaluate(() => document.querySelector('.aconbtnroles > input').getAttribute('onclick'));
        const classURL = this._findClassUrl(onClick);

        await this.page.goto(classURL, { waitUntil: 'load' });
        
        await this.page.click('.open-in-browser-button div.button-text');
        await this.page.waitForTimeout(1500);
    }

    async logout(){
        await this.classPage.close();
        await this.page.close();
    }

    _findClassUrl(onClick){
        const urlRegexp = /window\.open\(\'(.*?)\'/i;
        const [, classURL] = urlRegexp.exec(onClick);
        return classURL;
    }
}

LMSDriver.userBrowsers = {};

module.exports = async (config) => {
    const driver = new LMSDriver(config);
    await driver.bootstrap();
    if(!(await driver.isLoggedIn())) await driver.login();
    await driver.attend();

    setTimeout(() => driver.logout(), config.duration)
}