import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Badge, Button } from 'react-bootstrap';

const CitySelector = ({ selectedCities, setSelectedCities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Hardcoded list of major African cities
  const africanCities = [
  // North Africa
  "Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Luxor", "Aswan",          // Egypt
  "Casablanca", "Rabat", "Marrakesh", "Fes", "Tangier",                        // Morocco
  "Tunis", "Sfax", "Sousse", "Bizerte",                                        // Tunisia
  "Algiers", "Oran", "Constantine", "Annaba",                                  // Algeria
  "Tripoli", "Benghazi", "Misrata", "Sabha",                                   // Libya
  "Khartoum", "Omdurman", "Port Sudan", "Nyala",                               // Sudan
  "Nouakchott", "Nouadhibou", "Kaédi", "Rosso",                                // Mauritania
  
  // West Africa
  "Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City",           // Nigeria
  "Abidjan", "Bouaké", "Yamoussoukro", "San Pedro",                            // Ivory Coast
  "Accra", "Kumasi", "Tamale", "Takoradi",                                     // Ghana
  "Dakar", "Saint-Louis", "Thiès", "Ziguinchor",                               // Senegal
  "Bamako", "Sikasso", "Mopti", "Kayes",                                       // Mali
  "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora",                     // Burkina Faso
  "Niamey", "Zinder", "Maradi", "Agadez",                                      // Niger
  "Lomé", "Sokodé", "Kara", "Kpalimé",                                         // Togo
  "Porto-Novo", "Cotonou", "Parakou", "Bohicon",                               // Benin
  "Freetown", "Bo", "Kenema", "Makeni",                                        // Sierra Leone
  "Monrovia", "Gbarnga", "Kakata", "Bensonville",                              // Liberia
  "Banjul", "Serekunda", "Brikama", "Bakau",                                   // Gambia
  "Conakry", "Nzérékoré", "Kankan", "Kindia",                                  // Guinea
  
  // East Africa
  "Nairobi", "Mombasa", "Kisumu", "Nakuru",                                    // Kenya
  "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar",                             // Ethiopia
  "Dar es Salaam", "Dodoma", "Mwanza", "Arusha",                               // Tanzania
  "Mogadishu", "Hargeisa", "Bosaso", "Kismayo",                                // Somalia
  "Kampala", "Entebbe", "Gulu", "Mbarara",                                     // Uganda
  "Kigali", "Butare", "Gisenyi", "Musanze",                                    // Rwanda
  "Bujumbura", "Gitega", "Ngozi", "Rumonge",                                   // Burundi
  "Djibouti", "Ali Sabieh", "Tadjourah", "Obock",                              // Djibouti
  "Asmara", "Keren", "Massawa", "Assab",                                       // Eritrea
  
  // Central Africa
  "Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani",                         // DRC
  "Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi",                           // Republic of Congo
  "Yaoundé", "Douala", "Garoua", "Bamenda",                                    // Cameroon
  "Bangui", "Bimbo", "Berbérati", "Bria",                                      // Central African Republic
  "N'Djamena", "Moundou", "Sarh", "Abéché",                                    // Chad
  "Malabo", "Bata", "Ebebiyín", "Mongomo",                                     // Equatorial Guinea
  "Libreville", "Port-Gentil", "Franceville", "Oyem",                          // Gabon
  
  // Southern Africa
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Soweto", "Port Elizabeth", "Bloemfontein",   // South Africa
  "Luanda", "Huambo", "Benguela", "Lubango",                                   // Angola
  "Maputo", "Beira", "Nampula", "Quelimane",                                   // Mozambique
  "Harare", "Bulawayo", "Mutare", "Gweru",                                     // Zimbabwe
  "Lusaka", "Ndola", "Kitwe", "Livingstone",                                   // Zambia
  "Windhoek", "Walvis Bay", "Swakopmund", "Rundu",                             // Namibia
  "Gaborone", "Francistown", "Maun", "Selebi-Phikwe",                          // Botswana
  "Maseru", "Teyateyaneng", "Mafeteng", "Hlotse",                              // Lesotho
  "Manzini", "Mbabane", "Big Bend", "Malkerns",                                // Eswatini
  "Lilongwe", "Blantyre", "Mzuzu", "Zomba"                                     // Malawi
];


  // Search cities when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = africanCities
      .filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 10); // Limit to 10 results
    setSearchResults(results);
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeCity = (cityToRemove) => {
    setSelectedCities(selectedCities.filter(city => city !== cityToRemove));
  };

  return (
    <div className="mb-4">
      <Form.Group>
        <Form.Label>Search for African Cities You Deliver To</Form.Label>
        <Form.Control
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start typing a city name..."
        />
      </Form.Group>

      {searchResults.length > 0 && (
        <ListGroup className="mt-2">
          {searchResults.map(city => (
            <ListGroup.Item 
              key={city} 
              action 
              onClick={() => handleCitySelect(city)}
              className="d-flex justify-content-between align-items-center"
            >
              {city}
              <Badge bg="primary">Add</Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {selectedCities.length > 0 && (
        <div className="mt-3">
          <h6>Selected Delivery Cities:</h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedCities.map(city => (
              <Badge key={city} bg="secondary" className="p-2 d-flex align-items-center">
                {city}
                <Button 
                  variant="link" 
                  className="text-white p-0 ms-2" 
                  onClick={() => removeCity(city)}
                  style={{ lineHeight: 1 }}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default CitySelector;
