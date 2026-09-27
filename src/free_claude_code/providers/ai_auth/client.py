"""AI Auth via its OpenAI-compatible proxy."""

from free_claude_code.core.anthropic import ReasoningReplayMode
from free_claude_code.providers.admission import ProviderAdmissionController
from free_claude_code.providers.base import ProviderConfig
from free_claude_code.providers.openai_chat import (
    NO_REASONING,
    OpenAIChatProfile,
    OpenAIChatProvider,
    OpenAIChatRequestPolicy,
)

_PROFILE = OpenAIChatProfile(
    OpenAIChatRequestPolicy(
        provider_name="AI_AUTH",
        reasoning_replay=ReasoningReplayMode.DISABLED,
    ),
    NO_REASONING,
)


class AiAuthProvider(OpenAIChatProvider):
    """AI Auth via its OpenAI-compatible chat completions endpoint."""

    def __init__(
        self, config: ProviderConfig, *, admission: ProviderAdmissionController
    ):
        super().__init__(
            config,
            profile=_PROFILE,
            admission=admission,
        )

