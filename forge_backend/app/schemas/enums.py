from enum import Enum

class GenderType(Enum):
    OTHER = 0
    MALE = 1
    FEMALE = 2
    NOTDISCLOSED = 3


class PronounType(Enum):
    NEUTRAL = 0
    MASCULINE = 1
    FEMININE = 2
    ALL = 3
    NONE = 4

class MachineUsageStatus(Enum):
    IN_PROGRESS = 0
    COMPLETED = 1
    FAILED = 2