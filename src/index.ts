import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  // ILabShell
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { IFileBrowserFactory } from "@jupyterlab/filebrowser";
import { IMainMenu } from '@jupyterlab/mainmenu';
import notebook from "./notebook-base.json"
import { onShapeIcon } from './icon';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'onshape_launcher',
  autoStart: true,
  requires: [ILauncher, IFileBrowserFactory, IMainMenu],
  activate: (app: JupyterFrontEnd, launcher: ILauncher, browser: IFileBrowserFactory, menu: IMainMenu) => {
    console.log('JupyterLab extension onshape_launcher is activated!');

    const commandOnShapeId = "onshape:launcher"
    app.commands.addCommand(commandOnShapeId, {
      label: "OnShape",
      execute: () => {
        const { path } = browser.defaultBrowser.model;
        return new Promise((resolve) => {
          app.commands
            .execute("docmanager:new-untitled", {
              path,
              type: "notebook",
            })
            .then((model) => {
              app.commands
                .execute("docmanager:open", {
                  factory: "Notebook",
                  path: model.path,
                })
                .then((widget) => {
                  widget.isUntitled = true;
                  widget.context.ready.then(() => {
                    widget.model.fromString(JSON.stringify(notebook));
                    resolve(widget);
                  });
                });
            });
        });
      }
    });

    const commandOnShape: ILauncher.IItemOptions = {
      command: commandOnShapeId,
      category: 'Notebook',
      rank: 0,
      kernelIconUrl: onShapeIcon
    };
    launcher.add(commandOnShape);
  }
};

export default plugin;
