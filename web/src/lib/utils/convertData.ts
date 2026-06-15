import type { DoorColumn, FormState, GroupField } from '../types';

export const convertData = (data: DoorColumn): FormState => {
  const newGroupsData: GroupField[] = [];
  if (data.groups) {
    const entries = Object.entries(data.groups);
    for (let i = 0; i < entries.length; i++) {
      newGroupsData[i] = { name: entries[i][0], grade: entries[i][1] };
    }
  }
  return {
    ...data,
    characters: data.characters || [''],
    groups: newGroupsData.length ? newGroupsData : [{ name: '', grade: undefined }],
    items: data.items || [{ name: '', metadata: '', remove: false }],
    lockpickDifficulty: data.lockpickDifficulty || [''],
  };
};
