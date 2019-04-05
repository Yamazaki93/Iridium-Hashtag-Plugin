let iridiumApp;
let labels = [];

module.exports.Initialize = (iridium) => {
    iridiumApp = iridium;
    iridium.Labels.GetAllLabels().then(l => {
        labels = l;
    });
    iridium.Labels.on(iridium.LabelsEvents.LabelsChanged, l => {
        labels = l;
    });
    iridium.TaskLists.on(iridium.TaskEvents.TaskCreated, (task) => {
        setLabelsBasedOnTaskData(iridium, task);
    });
}

function setLabelsBasedOnTaskData(iridium, taskData) {
    let possibles = taskData.title.split(' ');
    let newTitleParts = [];
    if (possibles.length > 1) {
        possibles.forEach((e, i) => {
            if (e.length && e[0] === '#') {
                let label = labels.find(_ => _.title.toLowerCase() === e.substring(1, e.length).trim().toLowerCase());
                if (label) {
                    iridium.TaskLists.ToggleTaskLabel(taskData.listId, taskData.id, label.title);
                }
            } else {
                newTitleParts.push(e.trim());
            }
        });
    }
    if (newTitleParts.length > 0) {
        let newTitle = newTitleParts.join(' ');
        if (newTitle) {
            iridium.TaskLists.UpdateTaskTitle(taskData.listId, taskData.id, newTitle);
        }
    }
}