import * as puppeteer from 'puppeteer';

export interface IChannel {
    
    /**
     * Getter for credentials object
     */
    getCredentials():object

   
    /**
     * Lunches the browser
     */
    lunchBrowser():Promise<puppeteer.Browser>;


    /**
     * Executes and starts the command that handles the social media postings
     */
    run():Promise<boolean>;
}