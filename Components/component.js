import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBVX-niMY45zNPmXGsrn8_gEvG36Zb3I8o",
  authDomain: "notification-f2eee.firebaseapp.com",
  databaseURL: "https://notification-f2eee-default-rtdb.firebaseio.com",
  projectId: "notification-f2eee",
  storageBucket: "notification-f2eee.appspot.com",
  messagingSenderId: "774250814579",
  appId: "1:774250814579:web:49b154e3360e0a96c89e06",
  measurementId: "G-K7RD263RWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [titre, setTitre] = useState('');
  const [details, setDetails] = useState('');
  const [medicaments, setMedicaments] = useState(['']); // Etat pour les médicaments
  const [requests, setRequests] = useState([]);
  
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const fetchRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notifications"));
      const formattedRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(formattedRequests);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération des demandes d\'ordonnance : ' + error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    try {
      const medicamentsObj = medicaments.reduce((acc, medicament, index) => {
        acc[`Medicament${index + 1}`] = medicament;
        return acc;
      }, {});
      
      await addDoc(collection(db, 'notifications'), {
        titre,
        description: details,
        ...medicamentsObj
      });
      Alert.alert('Succès', 'Demande d\'ordonnance soumise avec succès');
      setTitre('');
      setDetails('');
      setMedicaments(['']); // Réinitialise les médicaments après soumission
      fetchRequests();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la soumission de la demande d\'ordonnance : ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      Alert.alert('Succès', 'Demande d\'ordonnance supprimée avec succès');
      fetchRequests();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression de la demande d\'ordonnance : ' + error.message);
    }
  };

  const handleViewDetails = (request) => {
    Alert.alert('Détails de la demande', `Titre: ${request.titre}\nDescription: ${request.description}`);
  };

  const addMedicamentInput = () => {
    setMedicaments([...medicaments, '']);
  };

  const handleMedicamentChange = (text, index) => {
    const newMedicaments = medicaments.slice();
    newMedicaments[index] = text;
    setMedicaments(newMedicaments);
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.nav}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.titre}>Pharmalet</Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Text style={styles.menuIcon}>{isOpen ? 'X' : '☰'}</Text>
          </TouchableOpacity>
        </View>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => {
              toggleMenu();
              navigation.navigate('Login');
            }}>
              <Text style={[styles.dropdownItem, styles.logoutText]}>Deconnexion</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={styles.main}>
        <View style={styles.content}>
          <Text style={styles.heading}>Cherchez votre ordonnance dans la pharmacie</Text>
          <Text style={styles.description}>
            Créez et envoyez de nouvelles demandes d'ordonnance à enregistrer dans notre système de pharmacie.
          </Text>
          <View style={styles.form}>
            <Text style={styles.label}>Titre de la demande d'ordonnance</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez le titre de la demande d'ordonnance"
              value={titre}
              onChangeText={setTitre}
            />
            <Text style={styles.label}>Détails de la demande d'ordonnance</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Entrez les détails de la demande d'ordonnance"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.label}>Médicaments</Text>
            {medicaments.map((medicament, index) => (
              <View key={index} style={styles.medicamentContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Medicament ${index + 1}`}
                  value={medicament}
                  onChangeText={(text) => handleMedicamentChange(text, index)}
                />
              </View>
            ))}
            <Button title="Ajouter un médicament" color="#48BB78" onPress={addMedicamentInput} />
            <Button title="Soumettre la demande d'ordonnance" color="#48BB78" onPress={handleSubmit} />
          </View>
          <View style={styles.previousRequests}>
            <Text style={styles.subHeading}>Demandes d'ordonnance précédentes</Text>
            {requests.map(request => renderPrescriptionRequest(request, handleDelete, handleViewDetails))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function renderPrescriptionRequest(request, handleDelete, handleViewDetails) {
  return (
    <View style={styles.requestContainer} key={request.id}>
      <View style={styles.requestContent}>
        <Text style={styles.requestTitre}>{request.titre}</Text>
        <Text style={styles.requestDescription}>{request.description}</Text>
      </View>
      <View style={styles.requestActions}>
        <TouchableOpacity style={[styles.button, styles.waitingButton]} onPress={() => {}}>
          <Text style={styles.buttonText}>En attente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(request.id)}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={() => handleViewDetails(request)}>
          <Text style={styles.buttonText}>Voir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0fff4',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  titre: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48BB78',
  },
  menuButton: {
    paddingHorizontal: 12,
  },
  menuIcon: {
    fontSize: 20,
    color: '#48BB78',
  },
  dropdownItem: {
    padding: 16,
    fontSize: 16,
    color: '#48BB78',
  },
  logoutText: {
    fontSize: 14,
    color: '#48BB78',
  },
  main: {
    flex: 1,
    padding: 10,
  },
  content: {
    alignSelf: 'stretch', // Remove maxWidth
  },
  heading: {
    fontSize: 28, // Reduced font size
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    fontSize: 14, // Reduced font size
    color: '#4A5568',
  },
  form: {
    marginTop: 16,
    paddingHorizontal: 12, // Adjusted padding
  },
  input: {
    borderColor: '#48BB78',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 12, // Adjusted margin
  },
  textarea: {
    height: 100, // Reduced height
  },
  previousRequests: {
    marginTop: 16,
  },
  subHeading: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
  },
  requestContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E2E8F0',
    },
    requestContent: {
      marginBottom: 8,
    },
    requestTitre: {
      fontSize: 15,
      paddingBottom: 10,
      fontWeight: 'bold',
    },
    requestDescription: {
      fontSize: 12,
      color: '#4A5568',
      paddingBottom: 5,
    },
    requestActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: 5,
    },
    button: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    waitingButton: {
      backgroundColor: '#48BB78',
    },
    deleteButton: {
      backgroundColor: '#E53E3E',
    },
    viewButton: {
      backgroundColor: '#3182CE',
    },
  
});
