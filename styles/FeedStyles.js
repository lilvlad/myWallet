import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #fff;
  padding: 10px;
`;

export const FolderContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  z-index: 100;
`;

export const Card = styled.View`
  background-color: #f2f2f2;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  z-index: -1;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
`;

export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
  align-self: center;
  z-index: 10;
`;

export const UserInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  font-family: 'Lato-Regular'
  color: #000;
  height: 35px;
`;

export const PostTime = styled.Text`
  font-size: 12px;
  align-self: flex-start;
  font-family: 'Lato-Regular';
  color: #666;
  /* right: 90px; */
  top: -10px;
`;

export const PostText = styled.Text`
  font-size: 14px;
  font-family: 'Lato-Regular';
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 15px;
  color: #000;
`;

export const PostImg = styled.Image`
  width: 350px;
  height: 250px;
  border-radius: 10px;
`;

export const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 92%;
  align-self: center;
  margin-top: 15px;
`;

export const InteractionWrapper = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 10px;
`;

export const Interaction = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 3px 10px;
  background-color: ${props => (props.active ? '#2e64e515' : 'transparent')};
`;

export const InteractionText = styled.Text`
  font-size: 12px;
  font-family: 'Lato-Regular';
  font-weight: bold;
  color: ${props => (props.active ? '#2e64e5' : '#333')};
  margin-top: 5px;
  margin-left: 5px;
`;
