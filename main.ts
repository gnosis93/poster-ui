import { app, BrowserWindow, screen, ipcMain, ipcRenderer } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { PostsHelper } from './poster/helpers/posts.helper';
import { HotDogCondosImporter } from './poster/importers/hotdogcondos.importer';
import { Post } from './poster/models/post.interface';
import { ConfigHelper } from './poster/helpers/config.helper';
import { FacebookGroupPoster } from './poster/channels/facebook/facebook.group.poster';
import { FacebookPagePoster } from './poster/channels/facebook/facebook.page.poster';
import { ChannelBase } from './poster/channels/channel.base';
import { IChannel } from './poster/channels/channel.interface';
import { FacebookOldPagePoster } from './poster/channels/facebook/facebook-old.page.poster';
import { FacebookOldGroupPoster } from './poster/channels/facebook/facebook-old.group.poster';

//importing necessary modules

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

ConfigHelper.createConfigFile();

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      enableRemoteModule: false // true if you want to use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

ipcMain.addListener('getPostByName', async (event, args) => {
  let result = PostsHelper.getPostByName(args);
  event.sender.send('getPostByName', result);
});

ipcMain.addListener('deletePostByName', async (event, args) => {
  let result = PostsHelper.deletePostByName(args);
  event.sender.send('deletePostByName', result);
  console.log('deleted and sent')
});

ipcMain.addListener('getConfig',async (event,args) => {
  let config = ConfigHelper.getConfig();
  event.sender.send('getConfig', config);
});

ipcMain.addListener('getConfigValue',async (event,args) => {
  let configValue = ConfigHelper.getConfigValue(args);
  event.sender.send('getConfigValue', configValue);
});

ipcMain.addListener('fileExists',async (event,args) => {
  // let configValue = ConfigHelper.getConfigValue(args);
  let fileExists = fs.existsSync(args);
  event.sender.send('fileExists', fileExists);
});


ipcMain.addListener('getPosts', async (event, args) => {
  let result = await PostsHelper.getListOfPosts();
  event.sender.send('getPosts', PostsHelper.redefineListOfPosts(result.postsDirs, result.postsDirPath));
});

ipcMain.addListener('saveConfig', async (event, args) => {
  let result = await ConfigHelper.saveConfig(args);
  event.sender.send('saveConfig', true);
});

// ipcMain.addListener('validateConfig', async (event, args) => {
//   let errorMessage = await ConfigHelper.validateConfigData(args);
//   event.sender.send('validateConfig', errorMessage);
// });


ipcMain.addListener('websiteImport', async (event, args) => {
  let websiteImporter = new HotDogCondosImporter();
  try {
    await websiteImporter.run();
  } catch (e) {
    event.sender.send('websiteImport', false);
    console.error(e);
    return
  }
  console.log('Import completed');
  return event.sender.send('websiteImport', true);
})

ipcMain.addListener('restoreConfigToDefault', async (event, args) => {
  ConfigHelper.restoreConfigToDefaults();
  return event.sender.send('restoreConfigToDefault', true);
});

ipcMain.addListener('submitPostToFacebookPages', async (event, post: Post) => {
  // console.log('detail clicked 2')
  let config = ConfigHelper.getConfig();
  console.log(config);

  let result = true;
  try {
    let poster:IChannel|null = null;

    if(ConfigHelper.getConfigValue<boolean>('facebook_old_style',true) === true){
       poster = new FacebookOldPagePoster(
        config.facebook_pages,
        {
          username: config.facebook_email,
          password: config.facebook_password
        },
        post.images,
        post.content
      );
    }else{
       poster = new FacebookPagePoster(
        config.facebook_pages,
        {
          username: config.facebook_email,
          password: config.facebook_password
        },
        post.images,
        post.content
      );
    }
   

    await poster.run();

  } catch (e) {
    result = false;
    console.error(e);
  }

  return event.sender.send('submitPostToFacebookPages', result);

});

ipcMain.addListener('submitPostToFacebookGroups', async (event, post: Post) => {
  // console.log('detail clicked 2')
  let config = ConfigHelper.getConfig();
  console.log(config);

  let result = true;
  try {

    let poster:IChannel|null = null;

    if(  ConfigHelper.getConfigValue<boolean>('facebook_old_style',true) === true)      {
      poster = new FacebookOldGroupPoster(
        config.facebook_groups,
        {
          username: config.facebook_email,
          password: config.facebook_password
        },
        post.images,
        post.content
      );
    }else{
      poster = new FacebookGroupPoster(
        config.facebook_groups,
        {
          username: config.facebook_email,
          password: config.facebook_password
        },
        post.images,
        post.content
      );
    }
   

    await poster.run();

  } catch (e) {
    result = false;
    console.error(e);
  }

  return event.sender.send('submitPostToFacebookGroups', result);

});


try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400)
  });


  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
