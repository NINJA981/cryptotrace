import re
import hashlib

ETH_ADDRESS_REGEX = re.compile(r"^0x[0-9a-fA-F]{40}$")
TRON_ADDRESS_REGEX = re.compile(r"^T[1-9A-HJ-NP-za-km-z]{33}$")


def detect_blockchain(address: str) -> str:
    """
    Detects blockchain network from address format.
    Returns 'ethereum' or 'tron'.
    """
    if not address or not isinstance(address, str):
        raise ValueError("Address must be a non-empty string.")
    
    clean = address.strip()
    if clean.startswith("0x") and ETH_ADDRESS_REGEX.match(clean):
        return "ethereum"
    elif clean.startswith("T") and TRON_ADDRESS_REGEX.match(clean):
        return "tron"
    else:
        raise ValueError(f"Unrecognized cryptocurrency address format: {address}. Supported: Ethereum (0x...) and Tron (T...).")


def is_valid_crypto_address(address: str) -> bool:
    """Validates if address is a valid Ethereum or Tron address."""
    if not address or not isinstance(address, str):
        return False
    clean = address.strip()
    return bool(ETH_ADDRESS_REGEX.match(clean) or TRON_ADDRESS_REGEX.match(clean))


def is_valid_eth_address(address: str) -> bool:
    """Validates Ethereum 20-byte hex address."""
    if not address or not isinstance(address, str):
        return False
    return bool(ETH_ADDRESS_REGEX.match(address.strip()))


def is_valid_tron_address(address: str) -> bool:
    """Validates Tron Base58 address starting with T."""
    if not address or not isinstance(address, str):
        return False
    return bool(TRON_ADDRESS_REGEX.match(address.strip()))


def normalize_address(address: str) -> str:
    """Normalizes address according to its blockchain standard."""
    chain = detect_blockchain(address)
    clean = address.strip()
    if chain == "ethereum":
        return clean.lower()
    return clean  # Tron addresses are case-sensitive Base58


def normalize_eth_address(address: str) -> str:
    """Normalizes Ethereum address to lowercase string with 0x prefix."""
    if not is_valid_eth_address(address):
        raise ValueError(f"Invalid Ethereum address format: {address}")
    return address.strip().lower()


def to_checksum_address(address: str) -> str:
    """Converts Ethereum address to EIP-55 checksum format."""
    if not is_valid_eth_address(address):
        raise ValueError(f"Invalid Ethereum address: {address}")
    
    clean_addr = address.strip().lower()[2:]
    try:
        keccak = hashlib.sha3_256(clean_addr.encode('utf-8')).hexdigest()
    except Exception:
        return f"0x{clean_addr}"
        
    checksum_chars = []
    for i, char in enumerate(clean_addr):
        if char.isdigit():
            checksum_chars.append(char)
        else:
            if int(keccak[i], 16) >= 8:
                checksum_chars.append(char.upper())
            else:
                checksum_chars.append(char.lower())
                
    return "0x" + "".join(checksum_chars)
