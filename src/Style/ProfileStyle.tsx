import {StyleSheet} from 'react-native';

export const Profile = StyleSheet.create({
  parent: {
    position: 'relative',
    flex: 1,
  },
  gradient: {
    height: 350,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
  },
  container: {
    width: 250,
    height: 100,
    flexDirection: 'column',
    position: 'absolute',
    top: 120,
  },
  nom: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  prenom: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  avatar: {

    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
    top: 250,
    overflow:'hidden',
    alignItems:'center',
    justifyContent:'center'
  },
  img:{
    width:'110%',
    height:'110%',
  },
  logoutButtont:{
    backgroundColor:'#6499E9',
    position:'absolute',
    top:560,
    width:150,
    height:50,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
  },
  logoutText:{
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color:'white'
  },
  role:{
    fontSize:25,
    position:'absolute',
    top:480
  },
});
