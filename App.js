import React, { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [transactions, setTransactions] = useState([]);

  const API_URL =
    'https://v6.exchangerate-api.com/v6/560a84e9f952987e607f6616/latest/USD';

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.result === 'success') {
        setCurrencies(Object.keys(data.conversion_rates));
        setExchangeRates(data.conversion_rates);
      } else {
        Alert.alert('Error', 'Failed');
      }
    } catch (error) {
      Alert.alert('Error', 'try again.');
    }
  };

  const handleConversion = () => {
    if (!amount) {
      Alert.alert('Error', 'Enter a valid amount');
      return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      Alert.alert('Error', 'Invalid');
      return;
    }

    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const result = (amount * rate).toFixed(2);
    setConvertedAmount(result);

    const transaction = {
      id: Date.now().toString(),
      from: fromCurrency,
      to: toCurrency,
      amount,
      converted: result,
      date: new Date().toLocaleString(),
    };

    setTransactions([transaction, ...transactions.slice(0, 4)]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <RNPickerSelect
        onValueChange={setFromCurrency}
        items={currencies.map((currency) => ({
          label: currency,
          value: currency,
        }))}
        value={fromCurrency}
      />

      <TextInput
        value={amount}
        placeholder="Enter Amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        style={styles.input}
      />

      <RNPickerSelect
        onValueChange={setToCurrency}
        items={currencies.map((currency) => ({
          label: currency,
          value: currency,
        }))}
        value={toCurrency}
      />

      <Text style={styles.resultText}>
        Converted Amount: {convertedAmount ?? '--'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleConversion}>
        <Text style={styles.buttonText}>Convert</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Last 5 Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>{item.date}</Text>
            <Text style={styles.transactionText}>
              {item.amount} {item.from} → {item.converted} {item.to}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultText: { fontSize: 18, textAlign: 'center', marginVertical: 15 },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  transactionText: { fontSize: 16, textAlign: 'center' },
});
