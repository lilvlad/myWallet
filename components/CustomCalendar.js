import React, {useEffect} from 'react';
import {View, Pressable} from 'react-native';
import WeeklyCalendar from 'react-native-weekly-calendar';
import {CalendarList} from 'react-native-calendars';

const IconSize = 28;

const CustomCalendar = ({menu, back, calPress, selected, dayPress}) => {
  var date = new Date();

  const sampleEvents = [
    {
      start: '2022-04-06 09:00:00',
      duration: '00:50:00',
      note: 'Walkkkkk my dog',
    },

    {start: '2022-04-09 09:30:00', duration: '01:00:00', note: 'Schedule 1'},
    {start: '2022-04-09 11:00:00', duration: '02:00:00', note: 'Schedule 2'},
    {start: '2022-04-09 15:00:00', duration: '01:30:00', note: 'Schedule 3'},
    {start: '2022-04-07 18:00:00', duration: '02:00:00', note: 'Schedule 4'},
    {start: '2022-04-07 22:00:00', duration: '01:00:00', note: 'Schedule 5'},
  ];

  const found = sampleEvents.length;

  const LeftView = () => (
    <View>
      {menu && (
        <Pressable onPress={calPress}>
          <WeeklyCalendar
            themeColor="#9a99d4"
            events={sampleEvents}
            style={{height: 105}}
            onDayPress={dayPress}
          />
        </Pressable>
      )}
      {back && (
        <Pressable onPress={calPress}>
          <CalendarList themeColor="#9a99d4" />
        </Pressable>
      )}
    </View>
  );

  return (
    <View>
      <LeftView />
    </View>
  );
};

export default CustomCalendar;
