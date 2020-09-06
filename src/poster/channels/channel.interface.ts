import * as puppeteer from 'puppeteer';

export interface IChannel {
    
    /**
     * Getter for credentials object
     */
    getCredentials():object

    /**
     * Getter to fetch the list of pages that will be posted
     */
    getPostPages():Array<string>;

    /**
     * Lunches the browser
     */
    lunchBrowser():Promise<puppeteer.Browser>;


    /**
     * Executes and starts the command that handles the social media postings
     */
    run():Promise<boolean>;
}