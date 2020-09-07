export abstract class ChannelBase {
    
    /**
     * Helper function to delay the process , used to await loading of elements/html 
     * @param time time in miliseconds 
     */
    protected async delay(time:number) : Promise<void>{//inherited
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
    }

}